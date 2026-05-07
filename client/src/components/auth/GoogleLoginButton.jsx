import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { googleLoginAction } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const resultAction = await dispatch(googleLoginAction(tokenResponse.access_token));
      if (googleLoginAction.fulfilled.match(resultAction)) {
        toast({
          title: "Login successful!",
        });
        navigate("/");
      } else {
        toast({
          title: resultAction.payload || "Google login failed",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Google Login Failed",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      onClick={() => handleGoogleLogin()}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 mt-4 py-6 border-2 hover:bg-slate-50 transition-all duration-300 rounded-xl"
    >
      <FcGoogle className="h-6 w-6" />
      <span className="text-lg font-medium">Continue with Google</span>
    </Button>
  );
};

export default GoogleLoginButton;
