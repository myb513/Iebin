import java.util.ArrayList;
import java.util.Iterator;

public class Main extends Thread{
    static boolean saveResult;
    MobileSystem mobileSystem;
    static UI ui;
    static LoginSystemManager loginSystemManager;
    static Alarm alarm;
    static DBManager dbManager;
    static Update update;


    public static void main(String[] args) {
        dbManager = new DBManager();
        ui = new UI();
        loginSystemManager = new LoginSystemManager();
        alarm = new Alarm();
        update = new Update();

        String id = "";
        String pw ="";
        while(true) {
            while (true) {
                ArrayList<String> arrayList = ui.showLoginDialog();
                id = arrayList.get(0);
                pw = arrayList.get(1);
                if (id == null || pw == null) {
                    ui.showDialog("아이디와 비밀번호를 입력하세요");
                } else break;
            }
            loginSystemManager.setId(id);
            loginSystemManager.setPw(pw);
            proceedLogin(loginSystemManager);

            boolean b = loginSystemManager.getIsLogin();

            if(b == false){
                ui.showDialog("로그인 실패");
            }else{
                break;
            }


        }




        Date currentTime = getCurrentTimeFromMobileSystem();


        ui.showCanlendar(currentTime); //이번달의 달력화면을 출력





        ArrayList<String>  schedulesinfo = getSchedulesFromDB(); //스케쥴을 db에서 가져오기

        int n = len(schedulesinfo);

        ArrayList<Schedule> arrayList = new ArrayList<Schedule>();

        if(n == 0){
            ui.showDialog("업데이트가 필요합니다");
        }else{
            for(int i = 0; i < n; i++){
                Schedule schedule = new Schedule();
                schedule.setID(Integer.parseInt(schedulesinfo.get(i)));
                schedule.setTitle(schedulesinfo.get(i));
                schedule.setContents(schedulesinfo.get(i));
                //schedule.setDate(schedulesinfo.get(i));변환문제
                arrayList.add(schedule);
            }
        }

        ui.getCalendar().setScheduleArray(arrayList);

        ui.showSchedules(); // 각각의 스케쥴을 그리고 버튼을 만듦
        ui.applyShadow(); // 마감된 스케쥴을 음영처리


        ui.onClickListenerAlarm(ui.btnAlarm,alarm);
        //사용자가 알람버튼을 누른다면 아래의 코드 실행

        boolean alarmOn = alarm.getAlarmOn();


        //사용자가 생성버튼을 누른다면 아래의 코드 실행
        ScheduleInfo createDialogInput = ui.onClickListenerCreate();

        boolean result = saveScheduleInfoToDB(createDialogInput.title,createDialogInput.contents,createDialogInput.date);

        if(result == false){
            ui.showDialog("저장을 실패했습니다");
        }











        //일정 버튼을 눌러 상세보기를 하는 경우
        if(ui.onScheduleBtnClick()){

            Schedule schedule = getScheduleInfoFromDB(dbManager);
            if(schedule==null){
                ui.showDialog("상세내용을 불러오지 못하였습니다.");
            }else {
                ui.showDetailDialog(schedule.getID()); //ok 버튼을 누르면 수정또는 삭제


                /*사용자가 수정한 경우*/
                Schedule modifiedSchedule=ui.onClickListenerModify(schedule);
                int count = 0;
                ArrayList<Schedule> schedules = ui.getCalendar().getScheduleArray();
                Iterator<Schedule> iterator = arrayList.iterator();
                while(iterator.hasNext()) {
                    Schedule temp = iterator.next();
                    int a = temp.getID();
                    if(modifiedSchedule.getID() == a){
                        break;
                    }
                    count++;
                }
                schedules.set(count,modifiedSchedule);
                ui.getCalendar().setScheduleArray(schedules);  // 캘린더의 일정 리스트에서 해당 id의 스케쥴을 수정

                boolean b = saveScheduleInfoToDB(modifiedSchedule.getTitle(),modifiedSchedule.getContents(),modifiedSchedule.getDate()); // db에 수정된 내용 저장 성공 여부 반환

                if(!b)
                    ui.showDialog("수정을 실패했습니다.");


                /*사용자가 삭제한 경우*/



            }


        }

        if(ui.onUpdateBtnClick()){

            update.crawlingSchedule();
            update.separateScheduleType();

            ArrayList<Schedule> tasks = update.getTaskArray();

            for(int i = 0; i < tasks.size(); i++){

                boolean isSave = saveScheduleInfoToDB(tasks.get(i).getTitle(),tasks.get(i).getContents(), tasks.get(i).getDate());
                if(!isSave)
                    saveResult = false;
            }

            ArrayList<Schedule> attendances = update.getAttendanceArray();

            for(int i = 0; i < attendances.size(); i++){

                boolean isSave = saveScheduleInfoToDB(attendances.get(i).getTitle(), attendances.get(i).getContents(), attendances.get(i).getDate());
                if(!isSave)
                    saveResult = false;
            }

            ArrayList<Schedule> notices = update.getNoticeArray();

            for(int i = 0; i < notices.size(); i++){

                boolean isSave = saveScheduleInfoToDB(notices.get(i).getTitle(), notices.get(i).getContents(), notices.get(i).getDate());
                if(!isSave)
                    saveResult = false;
            }

            if(saveResult == false){
                ui.showDialog("업데이트 실패");
            }else{
                ui.showDialog("업데이트 완료");
            }


        }













        while(true){

            currentTime = getCurrentTimeFromMobileSystem();

            if(alarm.getTime() == currentTime){
                //알람 울림
                ArrayList<Schedule> todaySchedules = getTodaySchedules();
                sendAlarmtoMobile();
                ui.showTodayAlarmDialog(todaySchedules);


            }


        }























    }

    public static Date getCurrentTimeFromMobileSystem(){

        MobileSystem mobileSystem = new MobileSystem();

        Date currentTime = mobileSystem.getCurrentTime();

        return currentTime;
    }

    public static ArrayList<String> getSchedulesFromDB(){



        return new ArrayList<String>();
    }

    public static Schedule getScheduleInfoFromDB(DBManager dbManager){

        dbManager.connect();
        dbManager.executeQuery("스케쥴 요청");
        Schedule schedule = dbManager.getDB().getSchedule();
        dbManager.close();
        return schedule;
    }



    public static ArrayList<Schedule> getTodaySchedulesFromDB(Date date){
        //해당 날짜의 일정을 반환

        return new ArrayList<Schedule>();
    }

    public static boolean saveAlarmtoDB(Alarm alarm){

        dbManager.connect();
        dbManager.executeQuery("알람 저장");




        return true; //성공시 true
    }




    public static boolean saveScheduleInfoToDB(String a, String b, Date date){

        // 일정 정보를 DB에 저장

        return true; //성공시 true;
    }

    public static boolean saveAlarmToMobile(){

        // Alarm의 정보를 MobileSystem에 저장

        return true; //성공시 true;
    }

    public static int len(ArrayList<String> arrayList){
        return arrayList.size();
    }

    public static void proceedLogin(LoginSystemManager loginSystemManager){
        Boolean n=loginSystemManager.login(loginSystemManager.getId(),loginSystemManager.getPw());
        loginSystemManager.setIsLogin(n);
    }

    public static void getCurrentTimeFromMoblieSystem(MobileSystem mobileSystem){
        //현재 시간을 반환
    }

    public static ArrayList<Schedule> getTodaySchedules(){
        //오늘마감스케줄 반환

        Date date = getCurrentTimeFromMobileSystem();


        return getTodaySchedulesFromDB(date);

    }

    public static ScheduleInfo getScheduleInfo(){

        dbManager.connect();
        dbManager.executeQuery("스케쥴 정보 요청");
;
        ScheduleInfo scheduleInfo = dbManager.getDB().getScheduleInfo();
        dbManager.close();
        return scheduleInfo; //db에서 가져온 스케쥴 정보
    }

    public static boolean deleteScheduleFromDB(int id){
        //입력받은 id에 해당하는 Schedule을 삭제

        return true; // 성공시 true;
    }

    public static void sendAlarmtoMobile(){

        //모바일 시스템을 통해 알람을 울림
    }



}
