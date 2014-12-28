package uk.ac.surrey.cs.tvs.vec.pod;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;


/**
 * Servlet implementation class GetVote.
 * 
 * Provides a JSON response representing the state of the vote associated with the submitted serial number.
 */
@WebServlet(description = "Retrieves a submitted vote from the WBB", urlPatterns = { "/getVote" })
public class GetVote extends HttpServlet {

	private static final long serialVersionUID = 1L;
	public GetVote() {}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if (request.getParameterMap().containsKey("serialNumber")) {
			try {
				respond(processMessage(request.getParameter("serialNumber")), response);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			response.getWriter().println("VEC WBB Interface: No Serial Number Sent");
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		if (request.getParameterMap().containsKey("serialNumber")) {
			try {
				respond(processMessage(request.getParameter("serialNumber")), response);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			response.getWriter().println("VEC WBB Interface: No Serial Number Sent");
		}
	}
	
	private void respond(JSONObject vote, HttpServletResponse response) throws IOException{
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(vote.toString());
		out.flush();
	}
	
	private JSONObject processMessage(String serialNumber) throws JSONException, IOException, KeyStoreException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException, InvalidKeyException, SignatureException {
		QRCode code = (QRCode)this.getServletContext().getAttribute(serialNumber);
		JSONObject vote = code.getVote();		
		return vote;
	}
}
