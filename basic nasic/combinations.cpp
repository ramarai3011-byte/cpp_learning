#include <iostream>
using namespace std;
int fac(int f)
{
    int i,j=1;
    if(f==0)
    {
        return 1;
    }else 
    {
        for(i=1;i<=f;i++)
        {
            j=j*i;
        }
        return j;
    }
}
int main()
{
    int n,r;
    cout<<"enter n :"<<endl;
    cin>>n;
    cout<<"enter r :"<<endl;
    cin>>r;
    if(n<r)
    {
        cout<<"Invalid";
        return 0;
    }else if(n==r)
    {
        cout<<1;
        return 0;
    }else
    {
        int c=fac(n)/(fac(r)*fac(n-r));
        cout<<"the number of possible combination is: "<<c;
    }
    
}