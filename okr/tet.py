def tet():
    a=int(input())
    y=[1]
    q=0
    p=1
    while(True):
        h=0
        for i in range(2,p+1):
            if p%i==0:
                h+=1
        if h==1:
            y.append(p)
            q+=1
        p+=1
        if q==a-1:
            break;
    print(y)