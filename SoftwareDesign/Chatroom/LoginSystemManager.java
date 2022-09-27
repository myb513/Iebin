public class LoginSystemManager {

    private boolean isLogin;
    private LoginSystem loginSystem;
    private String id;
    private String pw;

    public boolean login(String id, String pw){
        //로그인 정보 일치시

        return true; // 아이디 비밀번호 일치시 로그인 성공 반환
    }

    public boolean connectLoginSystem(){
        return true; // 로그인 시스템 연결 성공시 true 반환
    }

    public boolean getIsLogin(){
        return this.isLogin;
    }

    public void setId(String id){
        this.id = id;
    }

    public void setPw(String pw){
        this.pw = pw;
    }

    public String getId(){
        return this.id;
    }

    public String getPw(){
        return this.pw;
    }

    public void setLoginSystem(LoginSystem loginSystem){
        this.loginSystem = loginSystem;
    }

    public LoginSystem getLoginSystem() {
        return this.loginSystem;
    }

    public void setIsLogin(boolean isLogin) {
        this.isLogin = isLogin;
    }
}
