#include <iostream>
using namespace std;
int gugi(int r);
int main()
{
    cout<<"hello nih"<<endl;
    ;
    int x;
    cin>>x;
    int y=gugi(x);
    cout<<endl<<"Square of the number is "<<y;
    return 0;
}
int gugi(int r)
{
    int j = r*r;
    return j;
}