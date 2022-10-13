import numpy as np, cv2

# 흰 배경 3채널 영상으로 400*600 크기로 설정
image = np.full((400, 600, 3), (255, 255, 255), np.uint8)

# 빨강색 파랑색 변수 할당
red, blue = (0, 0, 255), (255, 0, 0)


center1 = (int(image.shape[1]/2), int(image.shape[0]/2))   # 원의 중심
size1 = (int(image.shape[1]/8), int(image.shape[1]/8))  # 반지름은 높이의 1/4 (image.shape[1]/4 * 1/2)


cv2.ellipse(image, center1, size1,  0, 0, -180, red, -1)
cv2.ellipse(image, center1, size1,  0, 0, 180, blue, -1)


center2 = (int(image.shape[1]/2) - int(size1[1]/2), int(image.shape[0]/2))   # 원의 중심

size2 = (int(image.shape[1]/16), int(image.shape[1]/16))  # 큰 원의 반지름의 반
cv2.ellipse(image, center2, size2,  0, 0, 180, red, -1)

center3 = (int(image.shape[1]/2) + int(size1[1]/2), int(image.shape[0]/2))   # 원의 중심
cv2.ellipse(image, center3, size2,  0, 0, -180, blue, -1)

cv2.imshow('image', image)
cv2.waitKey(0)