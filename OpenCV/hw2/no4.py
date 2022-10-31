import numpy as np, cv2

def trackbar(value) :

    alpha = cv2.getTrackbarPos('image1', title) / 100  # getTracbarPos 함수는 트랙바의 위치를 가져온다 이것으로 영상의 알파 베타 값을 추출
    beta = cv2.getTrackbarPos('image2', title) / 100


    image3 = cv2.addWeighted(image1, alpha, image2, beta, 0)  # addWeight함수를 통해 섞을 수 있다.
    result[0:b, a:a * 2] = image3[0:b, 0:a]                        # 슬라이스 연산자로 배열의 가운데 image3 넣자

    cv2.imshow(title, result)


image1 = cv2.imread("images/add1.jpg", cv2.IMREAD_GRAYSCALE) # 왼쪽에 들어갈 사진
image2 = cv2.imread("images/add2.jpg", cv2.IMREAD_GRAYSCALE) # 오른쪽에 들어갈 사진
if image1 is None or image2 is None: raise Exception("영상 파일 읽기 오류 발생")  #영상 파일 읽기 예외처리
title = ' dst'


alpha, beta = 0.5, 0.5 #알파, 베타값 설정
image3 = cv2.addWeighted(image1, alpha, image2, beta, 0)   # 가운데에 들어갈 사진

a, b = image1.shape                                          # a = 가로, b = 세로
result = np.zeros((a, b * 3), np.uint8)                           # image 3개가 딱 들어갈 수 있는 결과 배열을 만듦
result[0: b, 0: a] = image1[0: b, 0: a]
result[:, a * 2:] = image2[0: b, 0:a]
result[0:b, a:a * 2] = image3[0:b, 0:a]

cv2.imshow(title, result)


cv2.createTrackbar('image1', title, 50, 100, trackbar) #createTrackBar 함수 이용해서 트랙바 달기
cv2.createTrackbar('image2', title, 50, 100, trackbar)


cv2.waitKey(0)