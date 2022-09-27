public class DBManager {

    private DB db = new DB();

    public DBManager() {
        this. db = null;
    }

    public boolean executeQuery(String query){
        return true; // 쿼리 실행 성공시 true 반환
    }



    public boolean connect(){
        return true; // 연결 성공시 true 반환
    }

    public boolean close(){
        return true; // DB 연결 끊기 성공시 true 반환
    }

    public void setDB(DB db){
        this.db = db;
    }

    public DB getDB() {
        return this.db;
    }

}
