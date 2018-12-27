package JDKProxyStudy;

import org.junit.Test;


public class TestJDKProxy {

   @Test
    public void test1(){
       IHelloWorld helloWorld = (IHelloWorld)HelloWorldProxy.bind(new HelloWorldImpl());
       System.out.println(helloWorld.sayHelloToCountry("美国"));
   }
}
