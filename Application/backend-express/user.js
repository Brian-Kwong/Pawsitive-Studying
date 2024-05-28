import { User } from "./schema.js";

export async function getUserTasks(req, res) {
    const userId = req.params.id; // 从URL中获取用户ID

    try {
        // 查找指定用户ID的用户
        const user = await User.findById(userId).select("tasks");

        // 如果用户不存在，返回404错误
        if (!user) {
            return res.status(404).send("User not found");
        }

        // 返回用户的任务列表
        res.status(200).json({ tasks: user.tasks });
    } catch (error) {
        // 处理错误
        console.error("Error fetching tasks:", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function addUserTask(req, res) {
    const userId = req.params.id; // 从URL中获取用户ID
    let { name, course, description, time, points } = req.body; // 从请求主体中获取任务信息

    // 验证输入
    if (!name || !time) {
        return res.status(400).send("Bad request: Invalid input data.");
    }

    points = points || time * 10; // 如果未提供积分，则默认为0

    try {
        // 查找指定用户ID的用户
        const user = await User.findById(userId);

        // 如果用户不存在，返回404错误
        if (!user) {
            return res.status(404).send("User not found");
        }

        // 创建新任务
        const newTask = {
            name,
            course: course || "None",
            description: description || "None",
            time,
            points,
        };

        // 将新任务添加到用户的任务列表中
        user.tasks.push(newTask);

        // 保存用户
        await user.save();

        // 返回新任务
        res.status(201).json(newTask);
    } catch (error) {
        // 处理错误
        console.error("Error adding task:", error);
        res.status(500).send("Internal Server Error");
    }
}
