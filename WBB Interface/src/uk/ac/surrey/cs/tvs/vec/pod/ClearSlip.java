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

/**
 * Servlet implementation class ClearSlip
 */
@WebServlet(description = "Clears slip from memory for specific serial number", urlPatterns = { "/clearSlip" })
public class ClearSlip extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public ClearSlip() {}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (request.getParameterMap().containsKey("serialNumber")) {
			try {
				respond(processMessage(request.getParameter("serialNumber")),response);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			response.getWriter().println("VEC WBB Interface: No Serial Number Sent");
		}
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		if (request.getParameterMap().containsKey("serialNumber")) {
			try {
				respond(processMessage(request.getParameter("serialNumber")),response);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			response.getWriter().println("VEC WBB Interface: No Serial Number Sent");
		}
	}
	
	private void respond(String message, HttpServletResponse response) throws IOException{
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(message);
		out.flush();
	}
	
	private String processMessage(String serialNumber) throws JSONException, IOException, KeyStoreException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException, InvalidKeyException, SignatureException {
		this.getServletContext().removeAttribute(serialNumber);
		return serialNumber + " cleared.";
	}
}
