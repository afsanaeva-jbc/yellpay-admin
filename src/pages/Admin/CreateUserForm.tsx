
import { useSelector} from "react-redux";
import type { RootState } from "../../app/store";
import CreateUser from "./CreateUser";

const CreateUserForm = () => {
  const roles = useSelector((state: RootState) => state.auth.roles);
  return (
    <div>
      <CreateUser roles={roles} />
    </div>
  );
};

export default CreateUserForm;
