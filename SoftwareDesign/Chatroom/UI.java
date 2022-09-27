
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Scanner;

public class UI{
    public Button btnCreate;
    public Button[] schedules;
    public Button btnUpdate;
    public Button btnAlarm;
    public Button btnNext;
    public Button btnPre;
    public Button btnDelete;
    public Button btnModify;
    private Calendar calendar = new Calendar();
    Scanner scanner = new Scanner(System.in);


    public UI (){

        this.btnCreate = new Button("Create");
        this.btnUpdate = new Button("Update");
        this.btnAlarm = new Button("Alarm");
        this.btnNext = new Button("next");
        this.btnPre = new Button("Pre");
        this.btnDelete = new Button("Delete");
        this.btnModify = new Button("Modify");

    }


    public void setCalendar(Calendar calendar){
        this.calendar = calendar;
    }

    public Calendar getCalendar() {
        return this.calendar;
    }

    public void showCanlendar(Date date){

        showButtons(); // 버튼을 만듦
        highlight(date); // 오늘 날짜에 하이라이트
    }
/*
    public Button createScheduleButton(Schedule schedule){


        return new Button();

        Button createScheduleButton = new Button();
        //createScheduleButton.setLabel("일정 추가");
        return createScheduleButton;




    }*/

    public ArrayList<String> showLoginDialog(){
        //Dialog dialog = new Dialog(new Frame());
        //입력창에서 사용자의 아이디와 비밀번호를 입력함
        ArrayList<String> arrayList = new ArrayList<>();
        String id = scanner.next();
        String pw = scanner.next();
        arrayList.add(id);
        arrayList.add(pw);
        return arrayList;
    }

    public void showAlarmDialog(Alarm alarm){



        System.out.println("시간을 입력하세요 : H / M");
        int h = scanner.nextInt();
        int m = scanner.nextInt();
        Date date = new Date();
        date.setHour(h);
        date.setMinute(m);
        alarm.setTime(date);

        alarm.setAlarmOn(true);// 알람 on 할당

    }

    public ScheduleInfo showCreateDialog(){

        System.out.println("일정 제목과 일정 내용 그리고 날짜를 입력하세요.");
        String title = scanner.next();
        String contents = scanner.next();
        int month = scanner.nextInt();
        int day = scanner.nextInt();
        Date date = new Date(month,day);
        ScheduleInfo scheduleInfo = new ScheduleInfo(title,contents,date);

        return scheduleInfo; // 할당한 스케쥴 반환
    }

    public void showDetailDialog(int id){

        int key = id;
        Schedule result = null;

        ArrayList<Schedule> arrayList = calendar.getScheduleArray();



        Iterator<Schedule> iterator = arrayList.iterator();
        while(iterator.hasNext()) {
            Schedule schedule = iterator.next();
            int a = schedule.getID();
            if(key == a){
                result = schedule;
                break;
            }
        }

        String  title = result.getTitle();
        String contents = result.getContents();
        Date  date = result.getDate();

        System.out.println("제목: "+ title +" 날짜 :" + date + "내용 : " + contents);
        showDeleteButton(result);
        showModifyButton(result);
    }

    public void showButtons(){

        this.btnCreate = new Button("Create");
        btnCreate.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                onClickListenerCreate();
            }
        });

        this.btnUpdate = new Button("Update");
        btnUpdate.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                onClickListenerUpdate();
            }
        });
        this.btnAlarm = new Button("Alarm");
        //알람 리스너는 메인에서 작성 :: onclicklistenerAlarm
        this.btnNext = new Button("Next");
        this.btnPre = new Button("Pre");

    }

    public void highlight(Date date){
        //오늘 날짜에 하이라이트 표시
    }



    public ScheduleInfo onClickListenerCreate(){
        ScheduleInfo scheduleInfo = showCreateDialog();
        String title = scheduleInfo.title;
        String contents = scheduleInfo.contents;
        Date date = scheduleInfo.date;
        calendar.createSchedule(title,contents,date);

        return scheduleInfo;
    }

    public void onClickListenerAlarm(Button btn,Alarm alarm){ //파라미터 void인데 이건 버튼을 넣은걸로 일단 해봤음


        btn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showAlarmDialog(alarm);

            }
        });



    }

    public void onClickListenerUpdate(){ //파라미터 void인데 이건 버튼을 넣은걸로 일단 해봤음


    }

    public void onClickListenerNext(Button btn){ //파라미터 void인데 이건 버튼을 넣은걸로 일단 해봤음
/*
        btn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                //Next 버튼 클릭시 동작 수행
            }
        });
*/
    }

    public void onClickListenerPre(Button btn){ //파라미터 void인데 이건 버튼을 넣은걸로 일단 해봤음
/*
        btn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                //Pre 버튼 클릭시 동작 수행
            }
        });
*/
    }

    public void onClickListenerSchedule(Button btn, int id){ //파라미터 void인데 이건 버튼을 넣은걸로 일단 해봤음

        btn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showDetailDialog(id);
            }
        });
    }

    public Schedule onClickListenerModify(Schedule a){

        String title = "";
        String contents = "";




        while(title != "" && contents != ""){
            System.out.println("제목과 내용 입력 : ");
            title = scanner.next();
            contents = scanner.next();
            if(title == "" || contents == "")
                showDialog("수정할 내용을 입력하세요");

        }
        a.setTitle(title);
        a.setContents(contents);

        return a;



    }

    public void onClickListenerDelete(Schedule a){
        showDialog("일정을 삭제하시겠습니까?");

        boolean calendarDelete = getCalendar().deleteSchedule(a.getID());


        boolean DBdelete =deleteScheduleFromDB(a.getID());
        if(!calendarDelete || !DBdelete)
            showDialog("삭제를 실패했습니다.");

    }

    public void onClickListenerOK(Button btn){ //파라미터 void인데 이건 버튼을 넣은걸로 일단 해봤음
/*
        btn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                //OK 버튼 클릭시 동작 수행
            }
        });
*/
    }

    public void showDialog(String input){

        Dialog dialog = new Dialog(new Frame());

        dialog.setTitle(input);
        dialog.show();

    }

    public void showTodayAlarmDialog(ArrayList<Schedule> list){
        for(int i = 0; i<list.size(); i++){
            System.out.println(list.get(i));
        }
    }

    public void showSchedules(){
        ArrayList<Schedule> scheduleArrayList = this.calendar.getScheduleArray();


        for(int i = 0; i < scheduleArrayList.size(); i++){
            Button btn = new Button(scheduleArrayList.get(i).getTitle());


            int j = scheduleArrayList.get(i).getID();


            onClickListenerSchedule(btn,j);

            schedules[i] = btn;


        }

        // 스케쥴 버튼 만들기
    }

    public boolean onScheduleBtnClick(){
        return true;

    }

    public boolean onUpdateBtnClick(){
        return true;

    }


    public void applyShadow(){

        //일정이 지난 Schedule을 음영 처리 ;;
    }

    public void showDeleteButton(Schedule a) {
        Button button = new Button("Delete");
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                onClickListenerDelete(a);
            }
        });
        }

    public void showModifyButton(Schedule a) {
        Button button = new Button("Modify");
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Schedule schedule = onClickListenerModify(a);
            }
        });


    }
    public static boolean deleteScheduleFromDB(int id){
        //입력받은 id에 해당하는 Schedule을 삭제

        return true; // 성공시 true;
    }

}
