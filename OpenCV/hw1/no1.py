import numpy as np, cv2

mat1 = np.full((200, 300), 100, np.uint8)
mat2 = np.full((200, 300), 100, np.uint8)
title1, title2 = 'win mode1', 'win mode2'

cv2.namedWindow(title1, cv2.WINDOW_AUTOSIZE)
cv2.namedWindow(title2)
w, h = mat1.shape

cv2.moveWindow(title1, 0, 0)
cv2.moveWindow(title2, h, w)  # title1의 열인 300, 행인 200만큼 이동

cv2.imshow(title1, mat1)                       # 행렬 원소를 영상으로 표시
cv2.imshow(title2, mat2)
cv2.waitKey(0)                                  # 키 이벤트(key event) 대기
cv2.destroyAllWindows()