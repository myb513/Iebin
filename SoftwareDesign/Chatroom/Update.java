import java.util.ArrayList;
import java.util.Iterator;

public class Update {

    private ArrayList<Schedule> scheduleArray;
    private ArrayList<Schedule> taskArray;
    private ArrayList<Schedule> attendanceArray;
    private ArrayList<Schedule> noticeArray;
    private LMS lms = new LMS();

    public ArrayList<Schedule> crawlingSchedule(){

        this.scheduleArray = lms.crawling();
        //LMS에서 일정에 대한 정보를 크롤링 후 삽입

        return scheduleArray;
    }

    public void separateScheduleType(){

        Iterator<Schedule> iterator = this.scheduleArray.iterator();
        while(iterator.hasNext()) {
            Schedule temp = iterator.next();
            int a = temp.getType();
            if(a==0){//task
                this.taskArray.add(temp);
            }
            else if(a==1){//attendance
                this.attendanceArray.add(temp);
            }
            else if(a==2){//notice
                this.noticeArray.add(temp);
            }
        }



        ArrayList<Schedule> schedules = new ArrayList<Schedule>();
        //분류된 일정파트 삽입
        ArrayList<Schedule> tasks = new ArrayList<Schedule>();
        //분류된 과제파트 삽입
        ArrayList<Schedule> attendances = new ArrayList<Schedule>();
        //분류된 출석파트 삽입
        ArrayList<Schedule> notices = new ArrayList<Schedule>();
        //분류된 공지파트 삽입


        this.scheduleArray = schedules;
        this.taskArray = tasks;
        this.attendanceArray = attendances;
        this.noticeArray = notices;

    }

    public ArrayList<Schedule> getTaskArray() {
        return this.taskArray;
    }

    public ArrayList<Schedule> getAttendanceArray() {
        return this.attendanceArray;
    }

    public ArrayList<Schedule> getNoticeArray() {
        return this.noticeArray;
    }

}
