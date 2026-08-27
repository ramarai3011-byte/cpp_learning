#include <iostream>
using namespace std;
int fac(int k);
int somth(int k);
int sqsum(int k);
int main()
{
    int i,j,k,l;
    cout<<"enter a number"<<endl;
    cin>>k;
    j=somth(k);
    i=fac(k);
    l=sqsum(k);

    cout<<endl<<"Somthing related to "<<k<<" is "<<j;
    cout<<endl<<"Factorial of "<<k<<" is "<<i;
    cout<<endl<<"Sum of squares of "<<k<<" is "<<l;
}
int somth(int k)
{
    int i,j=0;
    for(int i=1;i<=k;i++)
    {
        j=j+i*(i+1);
    }
    return j;
}
int fac(int k)
{
    int i,j;
    for (i=1,j=1;i<=k;i++)
    {
        j*=i;
    }
    return j;
}
int sqsum(int k)
{
    int i,j;
    for (i=1,j=0;i<=k;i++)
    {
        j+=(i*i);
    }
    return j;
}