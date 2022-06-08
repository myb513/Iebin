import java.util.ArrayList;
import java.util.Iterator;


public class Calendar {

    ArrayList<Schedule> scheduleArray;



    public Calendar() { //기본 생성자
        this.scheduleArray = new ArrayList<>();
    }

    public void setScheduleArray(ArrayList<Schedule> schedules){
        this.scheduleArray = schedules;
    }

    public ArrayList<Schedule> getScheduleArray(){
        return this.scheduleArray;
    }

    public void createSchedule(String title, String contents, Date date){
        //생성 수행

        ArrayList<Schedule> scheduleArrayList = this.scheduleArray;
        Schedule schedule = new Schedule(title,contents,date); // 스케쥴 객체 생성
        scheduleArrayList.add(schedule); // 생성된 스케쥴을 스케쥴 리스트에 삽입

    }

    public boolean deleteSchedule(int id) {

        /*사용자가 수정한 경우*/

        int count = 0;
        int before = scheduleArray.size();
        Iterator<Schedule> iterator = scheduleArray.iterator();
        while(iterator.hasNext()) {
            Schedule temp = iterator.next();
            int a = temp.getID();
            if(id == a){
                break;
            }
            count++;
        }
        scheduleArray.remove(count); // 캘린더의 일정 리스트에서 해당 id의 스케쥴을 삭제
        int after = scheduleArray.size();


        return (before - after == 1);
    }



}
