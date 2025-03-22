import express, { Request, Response } from "express";

import { getErrorMessage } from "../../utils/common_utils";
import SchoolFeatureRequestsModel from "../../models/SchoolFeatureRequestsModel.model";
import UserPermissionsModel from "../../models/UserPermissionsModel.model";
import { permission } from "process";

const router = express.Router();

router.get("/get-all-requests", async (req: Request, res: Response) => {
  try {
    const schoolFeatureRequestsModelObj = new SchoolFeatureRequestsModel();
    const schoolFeatureRequestList = await schoolFeatureRequestsModelObj.getAll({ status: 0 });

    const returnFeaturesList = [];
    for (const feature of schoolFeatureRequestList) {
      returnFeaturesList.push({
        id: feature.id,
        moduleName: feature.moduleName,
        status: feature.status,
      });
    }

    const returnObj = {
      featuresList: returnFeaturesList,
    };

    res.status(200).json({ status: "ok", ...returnObj });
  } catch (err) {
    res.status(500).json({ status: "error", error: getErrorMessage(err) });
  }
});

router.put("/request/complete/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const userPermissionsModelObj = new UserPermissionsModel();
    const schoolFeatureRequestsModelObj = new SchoolFeatureRequestsModel();
    const schoolFeatureRequestRecordObj = await schoolFeatureRequestsModelObj.getByParams({ status: 0, id });

    if (!schoolFeatureRequestRecordObj) {
      throw new Error("Id is invalid");
    }

    await schoolFeatureRequestsModelObj.update(schoolFeatureRequestRecordObj.id, {
      status: 1,
    });

    // add here the permission record to school
    await userPermissionsModelObj.create({
      userId: schoolFeatureRequestRecordObj.userId,
      moduleName: schoolFeatureRequestRecordObj.moduleName,
      modulePermission: "1111",
    });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
  }
});

router.put("/request/cancel/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const schoolFeatureRequestsModelObj = new SchoolFeatureRequestsModel();
    const schoolFeatureRequestRecordObj = await schoolFeatureRequestsModelObj.getByParams({ status: 0, id });

    if (!schoolFeatureRequestRecordObj) {
      throw new Error("Id is invalid");
    }

    await schoolFeatureRequestsModelObj.update(schoolFeatureRequestRecordObj.id, {
      status: 2,
    });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
  }
});

router.get("/get-all-feature-permissions/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    const userPermissionsModelObj = new UserPermissionsModel();

    const userPermissionsList = await userPermissionsModelObj.getAll({ userId: userId });

    const returnUserPermissionsList = userPermissionsList.map((obj) => {
      return {
        id: obj.id,
        moduleName: obj.moduleName,
        status: obj.status,
      };
    });

    const returnObj = {
      permissionsList: returnUserPermissionsList,
    };

    res.status(200).json({ status: "ok", ...returnObj });
  } catch (err) {
    res.status(500).json({ status: "error", error: getErrorMessage(err) });
  }
});

router.put("/toggle-permission/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const userPermissionsModelObj = new UserPermissionsModel();
    const userPermissionRecordObj = await userPermissionsModelObj.getByParams({ id: id });

    if (!userPermissionRecordObj) {
      throw new Error("Id is invalid");
    }

    await userPermissionsModelObj.update(userPermissionRecordObj.id, {
      status: userPermissionRecordObj.status === 0 ? 1 : 0,
    });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
  }
});

export default router;
