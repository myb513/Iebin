import numpy as np, cv2

logo = cv2.imread("images/logo.jpg", cv2.IMREAD_COLOR) # 로고 영상 읽기
if logo is None: raise Exception("영상 읽기 오류")

blue, green, red = cv2.split(logo) # 채널 분리

img_zero = np.zeros_like(blue)  # 빈 채널 생성(검정 영상)
blue_img = cv2.merge([blue, img_zero, img_zero]) # 파랑만 색 있고 나머지는 검정,
green_img = cv2.merge([img_zero, green, img_zero]) # 초록만 색 있고 나머지는 검정,
red_img = cv2.merge([img_zero, img_zero, red])    # 빨강만 색 있고 나머지는 검정으로 채널 합성

cv2.imshow('logo', logo)
cv2.imshow('blue_img', blue_img)
cv2.imshow('green_img', green_img)
cv2.imshow('red_img', red_img)
cv2.waitKey(0)