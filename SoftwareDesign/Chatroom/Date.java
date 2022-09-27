public class Date {
    int year;
    int month;
    int day;
    int hour;
    int minute;

    public Date(){
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
    }
    public Date(int month, int day){
        this.month = month;
        this.day = day;

    }

    public Date(int year, int month, int day, int h, int m){
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = h;
        this.minute = m;
    }

    public void setHour(int h){
        this.hour = h;
    }

    public void setMinute(int m){
        this.minute = m;
    }

    public int getHour() {
        return hour;
    }

    public int getMinute() {
        return minute;
    }
}
