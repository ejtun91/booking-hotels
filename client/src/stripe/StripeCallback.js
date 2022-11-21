import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserInLocalStorage } from "../actions/auth";
import { getAccountStatus } from "../actions/stripe";

const StripeCallback = () => {
  const history = useNavigate();
  const { auth } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth && auth.token) accountStatus();
  }, [auth]);

  const accountStatus = async () => {
    try {
      const res = await getAccountStatus(auth.token);
      //  console.log("USER ACCOUNT STATUS ON STRIPE CALLBACK", res);
      updateUserInLocalStorage(res.data, () => {
        // update redux
        dispatch({
          type: "LOGGEED_IN_USER",
          payload: res.data,
        });
        // redirect user to dashboard
        window.location.href = "/dashboard/seller";
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center p-5">
      <LoadingOutlined className="display-1 p-5 text-danger" />
    </div>
  );
};

export default StripeCallback;
