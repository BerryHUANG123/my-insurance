import org.apache.log4j.Logger;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)     //表示继承了SpringJUnit4ClassRunner类  
@ContextConfiguration(locations = {"classpath:spring/applicationContext-aop.xml",
        "classpath:spring/applicationContext-dao.xml",
        "classpath:spring/applicationContext-scan.xml",
        "classpath:spring/applicationContext-trans.xml",
        "classpath:spring/spring-mvc.xml",
})
@Transactional
public class BaseTest {
    protected static Logger logger = Logger.getLogger(BaseTest.class);
}