import numpy as np
import cv2


def onMouse(event, x, y, flags, param):
    global title, pt  # 전역 변수 참조

    if event == cv2.EVENT_LBUTTONDOWN:
        if pt[0] < 0:
            pt = [2*x, 2*y] # 시작 좌표 지정
        else:
            pt[0] -= x
            pt[1] -= y
            cv2.rectangle(image, pt, [x,y], (255, 0, 0), thickness)
            cv2.imshow(title, image)
            pt = [-1, -1]  # 시작 좌표 초기화

    elif event == cv2.EVENT_RBUTTONDOWN:
        if pt[0] < 0:
            pt = [round(x/2), round(y/2)]
        else:
            dx, dy = round(pt[0]-x/2), round(pt[1]-y/2)  # 두좌표간 간격
            pt[0] += round(x / 2)
            pt[1] += round(y / 2)
            radius = int(np.sqrt(dx * dx + dy * dy))
            cv2.circle(image, pt, radius, (0, 0, 255), thickness)
            cv2.imshow(title, image)
            pt = (-1, -1)  # 시작 좌표 초기화

def onChange(value):
    global thickness  # 전역 변수 참조
    thickness = value  # 트랙바 값을 굵기값으로 저장

image = np.full((400, 600, 3), (255, 255, 255), np.uint8) # 화면 크기 400*600
pt = [-1, -1]
thickness = 1 #초기 굵기값 1 초기화
title = "Draw Event"


cv2.imshow(title, image)                        # 윈도우에 영상 띄우기
cv2.createTrackbar("thickness", title, thickness, 10, onChange)	# 트랙바 콜백 함수 등록
cv2.setMouseCallback(title, onMouse)            # 마우스 콜백 함수 등록
cv2.waitKey(0)