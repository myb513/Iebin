import cv2
import numpy as np
import sys

title = "alphaimage"

alphaimg = cv2.imread("images/iu4.png", cv2.IMREAD_UNCHANGED)# 투명도를 체크하기위해 있는 그대로 들고옴

np.set_printoptions(threshold=sys.maxsize)
if alphaimg is None:
    raise Exception("영상 파일 읽기 에러")

#영역별 경계를 구하자
a = cv2.split(alphaimg)   # 사진을 각 채널을 분리

temp = 0
wboundary = 0
for i,j in enumerate(a[3][0]) :
    if(temp != j):
        print("가로경계가 검출됨! %d에서 %d로 전환 ! 경계는 %d" %(temp,j,i))
        wboundary = i-1
    temp = j

print("가로 경계는 %d" %wboundary)


temp2 = 0
hboundary = 0
for i,j in enumerate(a[3]) :
    if(temp2 != j[0]):
        print("세로경계가 검출됨! %d에서 %d로 전환 ! 경계는 %d" %(temp2,j[0],i))
        hboundary = i-1
    temp2 = j[0]

print("세로 경계는 %d" %hboundary)

mask1 = np.zeros(alphaimg.shape[:2], np.uint8)
mask1[0:hboundary, 0:wboundary] = 255

mask2 = np.zeros(alphaimg.shape[:2], np.uint8)
mask2[0:hboundary, wboundary:] = 255

mask3 = np.zeros(alphaimg.shape[:2], np.uint8)
mask3[hboundary:, 0:wboundary] = 255

mask4 = np.zeros(alphaimg.shape[:2], np.uint8)
mask4[hboundary:, wboundary:] = 255

sum_value1 = cv2.sumElems(mask1)  # 영역별 화소값의 합을 튜플로 반환하자
sum_value2 = cv2.sumElems(mask2)
sum_value3 = cv2.sumElems(mask3)
sum_value4 = cv2.sumElems(mask4)
print()

print("[영역1의 화소값의 합] = ", sum_value1)   # 영역별 평균 결과를 출력하자
print("[영역2의 화소값의 합] = ", sum_value2)
print("[영역3의 화소값의 합] = ", sum_value3)
print("[영역4의 화소값의 합] = ", sum_value4)
print()

cv2.imshow(title, alphaimg)   # 원본사진과 알파채널 띄우기
cv2.imshow("alpha", a[3])

cv2.waitKey(0)