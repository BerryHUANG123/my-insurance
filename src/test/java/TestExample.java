import com.myinsurance.dao.IMapMarkerDao;
import com.myinsurance.service.IMarkerService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;


public class TestExample extends BaseTest {

    @Autowired
    private IMarkerService markerService;

    @Test
    public void test(){
        System.out.println( markerService.list(1).isSuccess());
    }

}
