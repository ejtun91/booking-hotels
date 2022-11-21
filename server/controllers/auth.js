import User from "../models/User";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  // validation
  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be minimum 6 characters long");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send("Email is taken");
  //register
  const user = new User(req.body);
  try {
    await user.save();
    console.log("User Created ", user);
    return res.json({ ok: true });
  } catch (error) {
    console.log("CREATE USER FAILED ", error);
    return res.status(400).send("Error. Try Again.");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email }).exec();
    if (!user) res.status(400).send("User with that credentials not found");
    //compare password
    user.comparePassword(password, (error, match) => {
      console.log("COMPARE PASS IN LOGIN ERROR", error);
      if (!match || error) return res.status(400).send("Wrong credentials");
      //GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id: user.account_id,
          stripe_seller: user.stripe_seller,
          stripeSession: user.stripeSession,
        },
      });
    });
  } catch (error) {
    console.log("LOGIN ERROR", error);
    res.status(400).send("Signin failed");
  }
};
