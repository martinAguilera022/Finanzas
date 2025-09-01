import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
const OnboardingScreen: React.FC = () => {
    const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Usuario:", result.user.displayName, result.user.email);
      // Aquí podés redirigir al dashboard
    } catch (error: any) {
      console.error("❌ Error al iniciar sesión:", error.message);
    }
  };

  
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-between px-6 py-12">
      {/* Logo */}
      <div className="w-full flex justify-start ">
        <div className="grid grid-cols-2 ">
          <div className="bg-green-900 w-8 h-8 rounded-sm"></div>
          <div className="bg-white w-8 h-8 rounded-sm"></div>
          <div className="bg-white w-8 h-8 rounded-sm"></div>
          <div className="bg-green-900 w-8 h-8 rounded-sm"></div>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-start w-full max-w-md">
        <h1 className="text-4xl text-green-900 leading-snug font-bold">
          Controla tus Finanzas
        </h1>
        <p className="text-green-900 mt-4 text-xl">
          Lleva un registro sencillo de tus gastos, organiza tu dinero con
          facilidad y alcanza tus metas financieras con una experiencia clara e
          intuitiva.
        </p>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col items-center gap-4 max-w-md">
        {/* Botón de Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-green-900 text-white py-3 rounded-full text-lg font-medium flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Iniciar sesión con Google
        </button>

        <p className="text-sm text-green-900">
          ¿Ya tienes una cuenta?{" "}
          <a href="#" className="font-semibold underline">
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default OnboardingScreen;
