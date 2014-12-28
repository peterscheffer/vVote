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
 * Servlet implementation class VoteSlip
 */
@WebServlet(description = "Votes slip for specific serial number", urlPatterns = { "/voteSlip" })
public class VoteSlip extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public VoteSlip() {}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		if (request.getParameterMap().containsKey("serialNumber") &&
			request.getParameterMap().containsKey("dateVoted") &&
			request.getParameterMap().containsKey("locationVoted")) {
			try {
				String serialNumber = request.getParameter("serialNumber");
				String dateVoted = request.getParameter("dateVoted");
				String locationVoted = request.getParameter("locationVoted");
				respond(processMessage(serialNumber, dateVoted, locationVoted, null), response);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			response.getWriter().println("VEC WBB Interface: Required Parameters Not Sent");
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		if (request.getParameterMap().containsKey("serialNumber") &&
			request.getParameterMap().containsKey("dateVoted") &&
			request.getParameterMap().containsKey("locationVoted") &&
			request.getParameterMap().containsKey("submittedVote")) {
			try {
				JSONObject jsonVote = new JSONObject(request.getParameter("submittedVote"));
				String serialNumber = request.getParameter("serialNumber");
				String dateVoted = request.getParameter("dateVoted");
				String locationVoted = request.getParameter("locationVoted");
				respond(processMessage(serialNumber, dateVoted, locationVoted, jsonVote), response);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			response.getWriter().println("VEC WBB Interface: Required Parameters Not Sent");
		}
	}
	
	private void respond(String message, HttpServletResponse response) throws IOException{
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(message);
		out.flush();
	}
	
	private String processMessage(String serialNumber, String dateVoted, String locationVoted, JSONObject jsonVote) throws JSONException, IOException, KeyStoreException, NoSuchAlgorithmException, CertificateException, UnrecoverableKeyException, InvalidKeyException, SignatureException {
		QRCode code = (QRCode)this.getServletContext().getAttribute(serialNumber);
		if (code == null) {
			code = new QRCode(serialNumber);
		}
		code.vote(dateVoted, locationVoted, jsonVote);
		getServletContext().setAttribute(serialNumber, code);

		return code.toJSON();
	}
}
