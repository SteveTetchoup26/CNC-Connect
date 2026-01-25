// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { getMeThunk } from "@/store/auth/authSlice";

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// const AuthProvider = ({ children }: AuthProviderProps) => {
//   const dispatch = useAppDispatch();
//   const { token, user } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     // Si un token existe mais qu'on n'a pas les infos utilisateur, on les récupère
//     if (token && !user) {
//       dispatch(getMeThunk());
//     }
//   }, [token, user, dispatch]);

//   return <>{children}</>;
// };

// export default AuthProvider;

import { useEffect, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMeThunk } from "@/store/auth/authSlice";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (token  && !user) {
      dispatch(getMeThunk());
    }
  }, [token, user, dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
