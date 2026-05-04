import moment from "moment/moment.js";
import userSchema from "../modals/userSchema.js";

export const getProfile = async (req, res) => {
    try {
    const userId = req.user?.id;
        console.log(userId);
        
        const user = await userSchema?.findById(userId);
        if (!user) {
            res.status(400).json({
                status: false,
                message: "user not availible "
            })
        }
        else {
            res.status(200).json({
                status: true,
                data: {
                    _id: user?._id,
                    email: user?.email,
                    username: user?.username,
                    createDate:moment(user?.createdAt).format("DD-MM-YYYY")
                },
                message: "user Data fetched"
            })

        }

    }
    catch (error) {
        console.error(error)
        res.status(500).json({
            status: false,
            message: "internal server error "
        })
    }
}