const db = require("../model/database");


async function init() {
    let permissions = ["list_user", "change_permission", "confirm_post", "create_post", "create_comment"];
    let roles = [
        {
            id: 1,
            name: "Admin",
            permissions: [1, 2, 3, 4, 5]
        },
        {
            id: 2,
            name: "Mod",
            permissions: [3, 4, 5]
        },
        {
            id: 3,
            name: "User",
            permissions: [4, 5]
        },
        {
            id: 4,
            name: "No-comment",
            permissions: [4]
        },
        {
            id: 5,
            name: "No-post",
            permissions: [5]
        }
    ]
    for (let i = 0; i < permissions.length; i++) {
        await db.Permission.create({
            id: i + 1,
            name: permissions[i]
        })
    }

    for (let i = 0; i < roles.length; i++) {
        await db.Role.create({
            id: roles[i].id,
            name: roles[i].name
        })
        for(let e of roles[i].permissions){
            await db.RolePermission.create({
                role_id: roles[i].id,
                permission_id: e
            })
        }
    }
    console.log("Init done.")
}

init();