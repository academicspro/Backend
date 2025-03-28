import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import Razorpay from "razorpay";

// Create a cash payment record
export async function recordCashPayment(req: Request, res: Response, next: NextFunction):Promise<any> {
  try {
    const { feeId, amount } = req.body;

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    const payment = await prisma.payment.create({
      data: {
        feeId,
        amount,
        status: "Success",
        paymentDate: new Date(),
        method: "Cash",
      },
    });

    const totalPayments = await prisma.payment.aggregate({
      where: { feeId, status: "Success" },
      _sum: { amount: true },
    });

    if ((totalPayments._sum.amount || 0) >= fee.amount) {
      await prisma.fee.update({
        where: { id: feeId },
        data: { status: "Paid" },
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
}

// Create an online payment order via Razorpay
export async function createPaymentOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { feeId, amount } = req.body;

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    const paymentSecret = await prisma.paymentSecret.findUnique({
      where: { schoolId: fee.schoolId },
    });
    if (!paymentSecret) {
      return res.status(404).json({ message: "Payment secret not found" });
    }

    const razorpay = new Razorpay({
      key_id: paymentSecret.keyId,
      key_secret: paymentSecret.keySecret,
    });

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    await prisma.payment.create({
      data: {
        feeId,
        amount,
        razorpayOrderId: order.id,
        status: "Pending",
        paymentDate: new Date(),
        method: "Online",
      },
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
}

// Handle Razorpay webhook for payment success/failure
export async function handleWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { event, payload } = req.body;

    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: payload.payment.entity.order_id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (event === "payment.failed") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "Failed" },
      });
    } else if (event === "payment.succeeded") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "Success",
          razorpayPaymentId: payload.payment.entity.id,
        },
      });

      const fee = await prisma.fee.findUnique({ where: { id: payment.feeId } });

      if (!fee) {
        return res.status(404).json({ message: "Fee record not found" });
      }

      const totalPayments = await prisma.payment.aggregate({
        where: { feeId: payment.feeId, status: "Success" },
        _sum: { amount: true },
      });

      if ((totalPayments._sum.amount || 0) >= fee.amount) {
        await prisma.fee.update({
          where: { id: payment.feeId },
          data: { status: "Paid" },
        });
      }
    }

    res.json({ message: "Webhook handled successfully" });
  } catch (error) {
    next(error);
  }
}

// Get all payments
export async function getAllPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const payments = await prisma.payment.findMany();
    res.json(payments);
  } catch (error) {
    next(error);
  }
}

// Get a single payment by ID
export async function getPaymentById(req: Request, res: Response, next: NextFunction):Promise<any> {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
}

// Update payment status manually
export async function updatePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    res.json(updatedPayment);
  } catch (error) {
    next(error);
  }
}

// Delete a payment record
export async function deletePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await prisma.payment.delete({ where: { id } });

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    next(error);
  }
}
