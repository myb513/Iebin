public class ScheduleInfo {

    String title;
    String contents;
    Date date;
    int Id;


    public ScheduleInfo(){

        this("","",null);

    }

    public ScheduleInfo(String title, String contents, Date date){

        this.title = title;
        this.contents = contents;
        this.date = date;

    }
}
