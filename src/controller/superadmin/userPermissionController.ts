import { Request, Response } from "express";

import UserModel from "../../models/UserModel.model";
import UserPermissionsModel from "../../models/UserPermissionsModel.model";
import { getErrorMessage } from "../../utils/common_utils";
import { IUpdateUserPermissions } from "../../models/types/user-permissions";

export const getUserPermissionsById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const userModelObj = new UserModel();
        const userPermissionsModelObj = new UserPermissionsModel();

        const userObj = await userModelObj.getByParams({
            id: userId,
        });

        if (!userObj) {
            throw new Error("User id is invalid");
        }

        const permissionsList = await userPermissionsModelObj.getAll({
            userId: userId,
        });

        const returnPermissionsList = permissionsList.map((obj) => {
            const allPermissions = obj.modulePermission.split("").map((value) => parseInt(value));

            return {
                id: obj.id,
                module: obj.moduleName,
                access: allPermissions.includes(1),
                permission: {
                    create: allPermissions[0],
                    read: allPermissions[1],
                    update: allPermissions[2],
                    delete: allPermissions[3],
                    managePermissions: allPermissions[4],
                },
            };
        });

        const returnObj = {
            permissions: returnPermissionsList,
        };

        res.status(200).json({ message: "all permissions", ...returnObj });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
    }
};

export const updateUserPermissions = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const updateData = req.body.permissions as Array<IUpdateUserPermissions>;


        const userModelObj = new UserModel();
        const userPermissionsModelObj = new UserPermissionsModel();

        const userObj = await userModelObj.getByParams({
            id: userId,
        });

        if (!userObj) {
            throw new Error("User id is invalid");
        }

        for (let i = 0; i < updateData.length; i++) {
            const permissionObj = updateData[i];
            const existingPermissionObj = await userPermissionsModelObj.getByParams({
                id: permissionObj.id,
            });

            if (existingPermissionObj) {
                const newPermissionArray: Array<number> = [];

                if (permissionObj.permission.create === 0 || permissionObj.permission.create === 1) {
                    newPermissionArray.push(permissionObj.permission.create);
                }

                if (permissionObj.permission.read === 0 || permissionObj.permission.read === 1) {
                    newPermissionArray.push(permissionObj.permission.read);
                }

                if (permissionObj.permission.update === 0 || permissionObj.permission.update === 1) {
                    newPermissionArray.push(permissionObj.permission.update);
                }

                if (permissionObj.permission.delete === 0 || permissionObj.permission.delete === 1) {
                    newPermissionArray.push(permissionObj.permission.delete);
                }

                // special type of module permission i.e. manage permission
                if (
                    permissionObj.module === "user" &&
                    (permissionObj.permission.managePermissions === 0 || permissionObj.permission.managePermissions === 1)
                ) {
                    newPermissionArray.push(permissionObj.permission.managePermissions);
                }

                await userPermissionsModelObj.update(existingPermissionObj.id, {
                    modulePermission: newPermissionArray.join(""),
                });
            }
        }

        const permissionsList = await userPermissionsModelObj.getAll({
            userId: userId,
        });

        const returnPermissionsList = permissionsList.map((obj) => {
            const allPermissions = obj.modulePermission.split("").map((value) => parseInt(value));

            return {
                guid: obj.guid,
                module: obj.moduleName,
                access: allPermissions.includes(1),
                permission: {
                    create: allPermissions[0],
                    read: allPermissions[1],
                    update: allPermissions[2],
                    delete: allPermissions[3],
                    managePermissions: allPermissions[4],
                },
            };
        });

        const returnObj = {
            permissions: returnPermissionsList,
        };

        res.status(200).json({ message: "updated permissions", ...returnObj });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
    }
};
