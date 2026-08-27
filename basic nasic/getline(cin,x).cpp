#include <iostream>
using namespace std;
int main()
{
    string y,n;
    cout<<"Enter your full name ";
    getline(cin,y);
    cout<<"Enter your full name ";
    cin>>n;
    cout<<"Without getline: "<<n<<endl;
    cout<<"With getline: "<<y<<endl;
    return 0;    
}