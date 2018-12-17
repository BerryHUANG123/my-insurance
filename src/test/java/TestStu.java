import org.junit.Test;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;

public class TestStu {
    @Test
    public void test() {
        String a1 = "A";
        String a2 = "A";
        System.out.println(a1 == a2);
        System.out.println(a1.equals(a2));
    }

    @Test
    public void test2() {
        Integer a = Integer.MAX_VALUE;
        int b = 1000;
        System.out.println(a > a + 1);
        System.out.println(a.equals(b));
    }

    @Test
    public void test4() {
        test3();
    }

    @Test
    public void test5() {
        int[] a = new int[]{1, 2};
        System.out.println(a[2]);
    }

    @Test
    public void test6() {


        class A {
            final void show() {
                System.out.println("A");
            }
        }

        class B extends A {

        }


        B b = new B();
        b.show();

        A a = new B();
        a.show();
    }

    @Test
    public void test7() {


        class A {

            @Override
            protected void finalize() throws Throwable {

            }
        }
    }

    @Test
    public void test8() {
        //获取年月日时分秒

        Calendar cal = Calendar.getInstance();
        System.out.println(cal.get(Calendar.YEAR));
        System.out.println(cal.get(Calendar.MONTH)); // 0 - 11
        System.out.println(cal.get(Calendar.DATE));
        System.out.println(cal.get(Calendar.HOUR_OF_DAY));
        System.out.println(cal.get(Calendar.MINUTE));
        System.out.println(cal.get(Calendar.SECOND));
    }

    @Test
    public void test9() {
        //获取年月日时分秒
        LocalDateTime localDateTime = LocalDateTime.now();
        System.out.println(localDateTime.getYear());
        System.out.println(localDateTime.getMonthValue());
        System.out.println(localDateTime.getDayOfMonth());
        System.out.println(localDateTime.getHour());
        System.out.println(localDateTime.getMinute());
        System.out.println(localDateTime.getSecond());
    }

    @Test
    public void test10() {
        Date date = new Date();
        System.out.println(date.getTime());
        System.out.println(System.currentTimeMillis());
    }

    @Test
    public void test11() {
        char a = '1';
        char c = '2';
        char[] chs = {a, c};
        String b = new String(chs);
        System.out.println(chs);
    }

    @Test
    public void test12() {
        Integer a = 1;
        Integer b = Integer.valueOf(1);
        Integer c = 1000;
        Integer d = Integer.valueOf(1000);
        System.out.println(a == b);
        System.out.println(c == d);
    }

    @Test
    public void test13() {
        String a = "Abc";
        System.out.println(a.indexOf(65));
        ;
    }

    @Test
    public void test14() {
        String a = "abc";
        String[] strs = a.split("", 1);
        for (String str : strs) {
            System.out.println(str);
        }
    }

    @Test
    public void test15() {
        A a = new A();
        changeStr(a);
        System.out.println(a.a);
    }

    @Test
    public void test16() {
       String a = "abcd";
       changeStr(a);
        System.out.println(a);
    }

    class A{
       public String a = "abc";
    }
    private void changeStr(String a) {
        a="1";
    }

    private void changeStr(A a) {
        a.a+="1";
    }

    private int test3() {
        try {
            int a = 1 / 0;
            return 1;
        } catch (Exception e) {
            return 2;
        } finally {
            return 3;
        }
    }
}
