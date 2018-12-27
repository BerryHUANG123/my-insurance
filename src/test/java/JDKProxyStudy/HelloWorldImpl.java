package JDKProxyStudy;

public class HelloWorldImpl implements IHelloWorld {
    @Override
    public String sayHelloToCountry(String countryName) {
        System.out.println("你好!"+countryName);
        return "体验结束!谢谢!";
    }
}
