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
    let { name, course, description, time, points, completed } = req.body; // 从请求主体中获取任务信息

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
            completed: completed !== undefined ? completed : false,
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

// Removes the task from the user's task list
export async function removeUserTask(req, res) {
    try {
        const userId = req.params.id;
        const taskId = req.params.taskId;
        let user = await User.findById(userId);
        if (user === null || user === undefined) {
            res.status(404).send("User not found");
            return;
        } else {
            user.tasks = user.tasks.filter(
                (task) => task._id.toString() !== taskId.toString()
            );
            console.log(user.tasks);
            await user.save();
            res.status(204).send();
        }
    } catch (error) {
        console.error("Error removing task:", error);
        res.status(500).send("Internal Server Error Removing tasks");
    }
}

// Marks the task as done returns the new user object with task marked as done
export async function markTaskAsDone(req, res) {
    try {
        const userId = req.params.id;
        const taskId = req.params.taskId;
        let user = await User.findById(userId);
        if (user === null || user === undefined) {
            res.status(404).send("User not found");
            return;
        } else {
            user.tasks.forEach((task) => {
                if (task._id.toString() === taskId.toString()) {
                    task.completed = true;
                }
            });
            await user.save();
            res.status(201).json(user);
        }
    } catch (error) {
        console.error("Error removing task:", error);
        res.status(500).send("Internal Server Error Updating task tasks");
    }
}

export async function getCompletedTasks(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user === null || user === undefined) {
            res.status(404).send("User not found");
            return;
        } else {
            let userTasks = user.tasks;
            res.status(200).json({
                tasks: userTasks.filter((task) => task.completed),
            });
        }
    } catch (error) {
        console.error("Error fetching completed tasks:", error);
        res.status(500).send("Internal Server Error Fetching completed tasks");
    }
}

export async function editTasksDetails(req, res) {
    try {
        const userId = req.params.id;
        let { _id, name, course, description, time, points, completed } =
            req.body;
        let user = await User.findById(userId);
        if (user === null || user === undefined) {
            res.status(404).send("User not found");
            return;
        } else {
            user.tasks.forEach((task) => {
                if (task._id.toString() === _id.toString()) {
                    task.name = name === undefined ? task.name : name;
                    task.course = course === undefined ? task.course : course;
                    task.description =
                        description === undefined
                            ? task.description
                            : description;
                    task.time = time === undefined ? task.time : time;
                    task.points = points === undefined ? task.points : points;
                    task.completed =
                        completed === undefined ? task.completed : completed;
                }
            });
            await user.save();
            res.status(201).json(user);
        }
    } catch (error) {
        console.error("Error editing task:", error);
        res.status(500).send("Internal Server Error Editing tasks");
    }
}

// Add export functions to update user
// Need get and add for all
// Name, username, email, password
export async function getUserName(req, res) {
    // The name the user is looking for
    const id = req.params.id;
    try {
        // Look in MongoDB for name
        const user = await User.findById(id).select("name");
        if (!user) {
            return res.status(404).send("User not found");
        }
        // If found return the name
        res.status(200).json({ name: user.name });
    } catch (error) {
        res.status(500).send("Server error");
    }
}

export async function getUserUsername(req, res) {
    // The username the user is looking for
    const id = req.params.id;
    try {
        // Look in MongoDB for name
        const user = await User.findById(id).select("username");
        if (!user) {
            return res.status(404).send("Username not found");
        }
        // If found return the name
        res.status(200).json({ username: user.username });
    } catch (error) {
        res.status(500).send("Server error");
    }
}

export async function getUserEmail(req, res) {
    // The email the user is looking for
    const id = req.params.id;
    try {
        // Look in MongoDB
        const user = await User.findById(id).select("email");
        if (!user) {
            return res.status(404).send("Email not found");
        }
        // If found return email
        res.status(200).json({ email: user.email });
    } catch (error) {
        res.status(500).send("Server error");
    }
}

export async function addUserName(req, res) {
    const id = req.params.id;
    const name = req.body.name;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("name already exists");
        }
        // else push the new name
        user.name = name;
        await user.save();
        res.status(201).json(name);
    } catch (error) {
        res.status(500).send("Server error");
    }
}
export async function addUserUsername(req, res) {
    const id = req.params.id;
    const username = req.body.username;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("username already exists");
        }
        // else push the new name
        user.username = username;
        await user.save();
        res.status(201).json(username);
    } catch (error) {
        res.status(500).send("Server error");
    }
}

export async function addUserEmail(req, res) {
    const id = req.params.id;
    const email = req.body.email;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("email already exists");
        }
        // else push the new name
        user.email = email;
        await user.save();
        res.status(201).json(email);
    } catch (error) {
        res.status(500).send("Server error");
    }
}

export async function addPoints(req, res, next) {
    const userId = req.params.id;
    const task = req.body.task;
    const time = req.body.time;
    try {
        const user = await User.findById(userId);
        if (user === null || user === undefined) {
            res.status(404).send("User not found");
            return;
        } else {
            if (task === null || task === undefined) {
                let completed_task = user.tasks.filter(
                    () => task._id.toString() === task
                );
                if (completed_task.length === 0) {
                    res.status(404).send("Task not found");
                    return;
                } else {
                    user.points += task[0].points;
                    await user.save();
                    req.params.taskId = task._id;
                    next();
                }
            } else {
                user.points += time * 10;
                const updatedUser = await user.save();
                res.status(201).json(updatedUser);
            }
        }
    } catch (error) {
        console.error("Error adding points:", error);
        res.status(500).send("Internal Server Error Updating points");
    }
}

export async function getUserProfileImage(req, res) {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("No user exists");
        }
        return res.status(200).json({ profileImage: user.profileImage });
    } catch (error) {
        res.status(500).send("Server error");
    }
}

export async function addUserProfileImage(req, res) {
    const id = req.params.id;
    const profileImage = req.body.profileImage;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("No user exists");
        }
        // else push the new name
        user.profileImage = profileImage;
        await user.save();
        res.status(201).json(profileImage);
    } catch (error) {
        res.status(500).send("Server error");
    }
}
