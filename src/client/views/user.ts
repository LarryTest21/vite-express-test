import { ref } from "vue";
import axios from "axios";
import { signedIn } from "../store/signedIn"
import { userData } from "../store/userData"
import { isAdmin } from "../store/isAdmin";


export async function getUser() {
  const signedInCheck = signedIn()
  const admin = isAdmin()
  const userD = userData()
  const autoLogin = ref(false)
  if (JSON.parse(
    localStorage.getItem("autoLogin")!
  ) != undefined) {
    autoLogin.value = true
  }
  const email = localStorage.getItem("email");

  if (autoLogin && email != null) {



    const API_URL = "/api/user/autoLogin";
     await axios
      .post(API_URL, { email: email }).then((res) => {
        userD.data = res.data;
        signedInCheck.state = true
        signedInCheck.uid = res.data._id
        admin.state = res.data.clearance
        console.log(`output->admin.state`,admin.state)
      }).catch((err) => {
        if(err.response.status === 405) {
          localStorage.removeItem("autoLogin")
          localStorage.removeItem("email")

        } else {
          console.log(err);
        }
      })
  }

};

