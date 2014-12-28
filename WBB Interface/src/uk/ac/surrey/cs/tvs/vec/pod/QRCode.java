package uk.ac.surrey.cs.tvs.vec.pod;

import org.json.JSONObject;

public class QRCode {
	
  private String serialNumber = "";
  private String voted = "NO";
  private String audited = "NO";
  private String cancelled = "NO";
  private String discarded = "NO";
  private String expired = "NO";
  private String dateVoted = "";
  private String locationVoted = "";
  private JSONObject vote = null;
  
  public QRCode (String serialNumber) {
	  this.serialNumber = serialNumber;
  }
  
  public String getSerialNumber () {
	  return serialNumber;
  }
  
  public void vote (String dateVoted, String locationVoted, JSONObject vote) {
	  this.voted = "YES";
	  this.dateVoted = dateVoted;
	  this.locationVoted = locationVoted;
	  this.vote = vote;
  }
  
  public JSONObject getVote () {
	  return vote;
  }
  
  public String getIsVoted () {
	  return voted;
  }
  
  public void audit () {
	  this.audited = "YES";
  }
  
  public String getIsAudited () {
	  return audited;
  }
  
  public void cancel () {
	  this.cancelled = "YES";
  }
  
  public String getIsCancelled () {
	  return cancelled;
  }
  
  public void discard () {
	  this.discarded = "YES";
  }
  
  public String getIsDiscarded () {
	  return discarded;
  }
  
  public void expire () {
	  this.expired = "YES";
  }
  
  public String getIsExpired () {
	  return expired;
  }
  
  public String getDateVoted () {
	  return dateVoted;
  }
  
  public String getLocationVoted () {
	  return locationVoted;
  }
  
  public String toJSON () {
	  
	  String response = "{ \"serial_number\" : \"" + serialNumber + "\", \"unknown_error\" : \"NO\", \"mbb_connection\" : \"OK\", ";	  
	  response = response + "\"voted\" : \"" + voted + "\", ";
	  response = response + "\"audited\" : \"" + audited + "\", ";
	  response = response + "\"cancelled\" : \"" + cancelled + "\", ";
	  response = response + "\"discarded\" : \"" + discarded + "\", ";
	  response = response + "\"expired\" : \"" + expired + "\", ";
	  response = response + "\"date\" : \"" + dateVoted + "\", ";
	  response = response + "\"location\" : \"" + locationVoted + "\"";
	  response = response + "}";
	  
	  return response;
  }
}