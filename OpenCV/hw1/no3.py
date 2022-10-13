import cv2

image = cv2.imread("images/colorimage.jpg", cv2.IMREAD_GRAYSCALE ) # 컬러파일을 명암도 영상으로 적재
if image is None: raise Exception("영상 파일 읽기 에러")

cv2.imshow("test", image) #윈도우에 표시 후
cv2.waitKey(0) #키 이벤트 대기

params_jpg = (cv2.IMWRITE_JPEG_QUALITY, 0)  # JPEG 화질 가장 낮은 화질로 적은 용량 설정
params_png = [cv2.IMWRITE_PNG_COMPRESSION, 9]  # PNG 압축 레벨 가장 높은 값으로 적은 용량 설정

## 행렬을 영상 파일로 저장
cv2.imwrite("images/test.jpg", image, params_jpg)
cv2.imwrite("images/test.png", image, params_png)
print("저장 완료")