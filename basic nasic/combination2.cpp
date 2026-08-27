#include <iostream>
#include <cmath>
using namespace std;
double com(int n,int r)
{
    double c=1;
    for(double i=r,j=n;i>0;i--,j--)
    {
        c*=j/i;
    }
    return c;
}
int main()
{
    double n,r;
    cout<<"Enter n: ";
    cin>>n;
    cout<<"Enter r: ";
    cin>>r;
    cout<<"\nThe number of combination is :"<<com(n,r);
}