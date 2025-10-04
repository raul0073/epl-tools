import HomeClientComp from "@/components/root/main-wrapper/HomeClientComp";
import AuthLoaderPage from "./auth/signin/utils/AuthLoader";


export default function HomePage() {


  return <AuthLoaderPage>
    <HomeClientComp />
  </AuthLoaderPage>
}
