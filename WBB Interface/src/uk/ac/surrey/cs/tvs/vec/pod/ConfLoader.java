package uk.ac.surrey.cs.tvs.vec.pod;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.json.JSONObject;

public class ConfLoader implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		try {
			BufferedReader br = new BufferedReader(new InputStreamReader(arg0.getServletContext().getResourceAsStream("/WEB-INF/serviceconf.json")));
			StringBuffer sb = new StringBuffer();
			String line;
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}
			br.close();
			JSONObject district = new JSONObject(sb.toString());
			arg0.getServletContext().setAttribute("serviceConf", district);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}