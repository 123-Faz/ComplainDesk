import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {  getAuthToken, getUser } from "@/store/authSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const useAuthStatus = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector(getUser);
	const token = useAppSelector(getAuthToken);
	const [isAuth, setIsAuth] = useState(true);

	useEffect(() => {
		const authCheck = async () => {
			if (token && user) {
				setIsAuth(true);
			} else if (token && !user) {
				// loaderCalling
				try {
					await dispatch(fetchUser()).unwrap();
					setIsAuth(true);
				} catch (error) {
					Cookies.remove("token");
					setIsAuth(false);
					navigate("/");
				}
			} else {
				setIsAuth(false);
			}
		};

		authCheck();
	}, [token, user, dispatch, navigate]);

	return { isAuth, user, token };
};
