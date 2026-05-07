import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileAction } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Profile() {
  const { user, isActionLoading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
  });
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        bio: user.bio || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  function handleUpdateProfile(e) {
    e.preventDefault();
    dispatch(
      updateProfileAction({
        userId: user.id,
        ...formData,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Profile updated successfully!",
        });
      } else {
        toast({
          title: data?.payload?.message || "Update failed",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              placeholder="Your username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Your phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell us something about yourself"
              className="min-h-[100px]"
            />
          </div>
          <Button disabled={isActionLoading} type="submit" className="w-full">
            {isActionLoading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default Profile;
