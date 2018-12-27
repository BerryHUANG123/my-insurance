package JDKProxyStudy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class HelloWorldProxy implements InvocationHandler {

    private static Object target;


    //绑定真实对象,返回代理对象
    public static Object bind(Object target){
        HelloWorldProxy.target = target;
        return Proxy.newProxyInstance(target.getClass().getClassLoader(),target.getClass().getInterfaces(),new HelloWorldProxy());
    }

    @Override
    public  Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("安检开始...");
        System.out.println("安检结束...");
        Object obj = method.invoke(target,args);
        return obj;
    }
}
