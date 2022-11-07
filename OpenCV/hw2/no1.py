import numpy as np, cv2
import time

stime = 0
stime = time.perf_counter() #수행시간 측정

rands = np.zeros((10000, 5), np.uint16)
starts = cv2.randn(rands[:, 2:-1], 100, 50) # 2,3열에 시작점 저장
ends = cv2.randn(rands[:, :2 ], 100, 50) # 0, 1열에 종료점 저장

sizes = cv2.absdiff(starts, ends) #차분 절댓값함수를 통해 크기 반환
areas = sizes[:, 0] * sizes[:, -1] #넓이는 가로 * 세로

rects = rands.copy()
rects[:, :2] = sizes # 0, 1열에 size 저장 (종료점 좌표를 덮어씀)
rects[:, -1] = areas # 4열에 넓이 저장

print("------------------------------------------------")
print("사각형 원소 \t\t 랜덤 사각형 정보 \t\t 넓이 ")
print("------------------------------------------------")

# 정렬전 사각형 정보 출력
for i, (w,h,x,y,a) in enumerate(rects):
    print("rects[%4d] = [(%3d,%3d) from (%3d,%3d)] %5d" %(i, w, h, x, y, a))

idx = np.argsort(areas)[::-1] # 정렬 및 정렬 전 인덱스를 역순으로 만듦으로써 넓이 내림차순

print("------------------------------------------------")
print("사각형 원소 \t\t 랜덤 사각형 정보 \t\t 넓이 ")
print("------------------------------------------------")

#정렬전 인덱스를 순회하면서, 사각형 정보 출력
for i in idx :
    print("rects[%4d] = [(%3d, %3d) from (%3d,%3d)] %5d" %(i, rects[i][0], rects[i][1], rects[i][2], rects[i][3], rects[i][4]))

etime = time.perf_counter()
elapsed = (etime - stime)
print("수행시간 = %.5f sec" % elapsed)  # 초 단위 경과 시간