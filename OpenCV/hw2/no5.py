import cv2
import numpy as np


title = "alphaimage"

alphaimg = cv2.imread("images/iu4.png", cv2.IMREAD_UNCHANGED)# 투명도를 체크하기위해 있는 그대로 들고옴


if alphaimg is None:
    raise Exception("영상 파일 읽기 에러")

# 영역별 마스크 만들자
mask1 = np.zeros(alphaimg.shape[:2], np.uint8)
mask2 = np.zeros(alphaimg.shape[:2], np.uint8)
mask3 = np.zeros(alphaimg.shape[:2], np.uint8)
mask4 = np.zeros(alphaimg.shape[:2], np.uint8)
#  600 x 400 사진을 4등분하자
mask1[0:300, 0:200] = 255
mask2[0:300, 200:400] = 255
mask3[300:600, 0:200] = 255
mask4[300:600, 200:400] = 255

mask5 = np.full((700, 400, 3), (255,0,0), np.uint8)

mask5[round((400-320)/2):round((400+320)/2), round((700-320)/2):round((700+320)/2)] = (255,0,0)

a = cv2.split(alphaimg)   # 사진을 각 채널을 분리

print("알파 채널 : %s " % a[3])   # 알파 채널을 표시하자

mean_value1 = cv2.mean(alphaimg, mask1)  # 영역별 평균 결과를 튜플로 반환하자
mean_value2 = cv2.mean(alphaimg, mask2)
mean_value3 = cv2.mean(alphaimg, mask3)
mean_value4 = cv2.mean(alphaimg, mask4)
print()

print("[영역1의 채널별 평균] = ", mean_value1)   # 영역별 평균 결과를 출력하자
print("[영역2의 채널별 평균] = ", mean_value2)
print("[영역3의 채널별 평균] = ", mean_value3)
print("[영역4의 채널별 평균] = ", mean_value4)
print()

print("[영역1의 투명도 값의 평균] = ", mean_value1[3])
print("[영역2의 투명도 값의 평균] = ", mean_value2[3])
print("[영역3의 투명도 값의 평균] = ", mean_value3[3])
print("[영역4의 투명도 값의 평균] = ", mean_value4[3])



cv2.imshow(title, alphaimg)   # 원본사진과 알파채널 띄우기
cv2.imshow("test", mask5)   # 원본사진과 알파채널 띄우기
cv2.imshow("alpha", a[3])

cv2.waitKey(0)