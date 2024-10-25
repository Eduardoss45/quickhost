import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useAuth = (handleAuthenticated) => {
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    const verifyAuthentication = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("token");

      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        // Verifica se o token expirou
        if (decodedToken.exp < currentTime) {
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_BASE_URL}${
                import.meta.env.VITE_TOKEN_REFRESH_URL
              }`,
              { refresh: refreshToken }
            );
            console.log(
              `${import.meta.env.VITE_BASE_URL}${
                import.meta.env.VITE_TOKEN_REFRESH_URL
              }`
            );
            console.log(response);

            localStorage.setItem("token", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            localStorage.setItem("isAuthenticated", tokens.user.authenticated);

          } catch (error) {
            console.error("Erro ao renovar token:", error);
          }
        }
      }
    };

    verifyAuthentication();
  }, []);

  return { profilePicture, setProfilePicture };
};

export default useAuth;
