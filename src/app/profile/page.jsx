// import userService from "@entities/user/services";
import { LogoutButton } from "@features/auth";
// import { UserInfo } from "@entities/user";

import * as S from './styles';

export default async function Profile() {
  // const userEmail = localStorage.getItem('userEmail');

  // const userInfo = await userService.getUserByEmail({ email: userEmail });

  return (
    <div className="flex flex-col gap-4 items-start p-4">
      <h1 className="text-2xl font-bold">Профиль</h1>
      {/* <UserInfo email={userInfo.email} name={userInfo.name}/> */}
      <S.Wrapper>
        <LogoutButton />
      </S.Wrapper>
    </div>
  );
}
