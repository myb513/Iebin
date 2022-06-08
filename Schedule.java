

public class Schedule {
    private int id; //스케쥴의 id
    private int type; // 과제, 공지, 출석 구분
    private String title; // 일정 제목
    private String contents; // 일정 내용
    private Date date; // 마감 날짜

    public Schedule () { //기본 생성자
        this.id = 0;
        this.type = 0;
        this.title = "";
        this.contents = "";
        this.date = null;
    }

    public Schedule (String title,String contents, Date date){
        this.id = 0;
        this.type = 0;
        this.title = title;
        this.contents = contents;
        this.date = date;
    }

    public int getID(){
        return this.id;
    }

    public int getType(){
        return this.type;
    }

    public String getTitle(){
        return this.title;
    }

    public String getContents(){
        return this.contents;
    }

    public Date getDate(){
        return this.date;
    }

    public void setID(int id){
        this.id = id;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public void setContents(String contents){
        this.contents = contents;
    }

    public void setDate(Date date){
        this.date = date;
    }
}
