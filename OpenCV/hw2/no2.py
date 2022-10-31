import cv2 as cv2

a = int(input('높이 : ')) #사용자 터미널에 값 입력
b = int(input('너비 : '))

title = "ex11"

# 영상에서 잘라내는 방식
cap = cv2.VideoCapture("images/video.mp4")		# 동영상 파일 개방
if cap.isOpened():
    while True:
        ret, img = cap.read() #프레임 단위로 읽음

        #
        img[0:b, 0:round((a-320)/2)] = (0,0,255) # 테두리는 R값을 255로 준다.
        img[0:b, round((a + 320) / 2):a] = (0,0,255) 
        img[0:round((b-240)/2), 0:a] = (0,0,255)
        img[round((b+240)/2):b, 0:a] = (0,0,255)
        img[0:b, 0:round((a - 320) / 2) - 2] = (255, 0, 0) # 크기가 2 정도인 테두리만 남도록 2씩 차이를 준다.
        img[0:b, round((a + 320) / 2) + 2:a] = (255, 0, 0) # 나머지 부분은 B값을 255로 준다.
        img[round((b + 240) / 2)+2:b, 0:a] = (255, 0, 0)
        img[0:round((b - 240) / 2) - 2, 0:a] = (255, 0, 0)

        if ret:
            cv2.namedWindow(title, cv2.WINDOW_AUTOSIZE)
            cv2.imshow(title, img)

            cv2.resizeWindow(title, a, b)  #동영상 화면의 크기와 관계없이 창의 크기를 입력받은 높이와 너비로 설정
            cv2.waitKey(33)
        else:
            break
else:
    print('cannot open the file') #파일 열기 예외처리



cap.release()
cv2.destroyAllWindows()



